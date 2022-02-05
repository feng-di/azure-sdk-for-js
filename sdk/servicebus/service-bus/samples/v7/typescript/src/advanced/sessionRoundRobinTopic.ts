// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT Licence.

/**
 * This sample demonstrates how you can continually read through all the available
 * sessions in a Service Bus queue or subscription.
 *
 * Run the sendMessages sample with different session ids before running this sample.
 *
 * @summary Demonstrates how to continually read through all the available sessions
 */

import {
  ServiceBusClient,
  delay,
  ServiceBusSessionReceiver,
  ServiceBusReceivedMessage,
  isServiceBusError,
} from "@azure/service-bus";
import * as dotenv from "dotenv";
// import { AbortController } from "@azure/abort-controller";

dotenv.config();

const serviceBusConnectionString = process.env.SERVICEBUS_CONNECTION_STRING || "<connection string>";
const topicName = process.env.TOPIC_NAME_WITH_SESSIONS || "<queue name>";
const subscriptionName = process.env.SUBSCRIPTION_NAME || "<subscription name>";

const maxSessionsToProcessSimultaneously = 3;
const sessionIdleTimeoutMs = 0.01 * 1000;
const delayOnErrorMs = 0.01 * 1000;

// This can be used control when the round-robin processing will terminate
// by calling abortController.abort().
// const abortController = new AbortController();

// Called just before we start processing the first message of a session.
// NOTE: This function is used only in the sample and is not part of the Service Bus library.
async function sessionAccepted(sessionId: string) {
  console.log(`[${sessionId}] will start processing...`);
}

// Called by the ServiceBusSessionReceiver when a message is received.
// This is passed as part of the handlers when calling `ServiceBusSessionReceiver.subscribe()`.
async function processMessage(msg: ServiceBusReceivedMessage) {
  console.log(`[${msg.sessionId}] received message with body ${msg.body}`);
}

// Called by the ServiceBusSessionReceiver when an error occurs.
// This will be called in the handlers we pass in `ServiceBusSessionReceiver.subscribe()`
// and by the sample when we encounter an error opening a session.
async function processError(err: Error, sessionId?: string) {
  if (sessionId) {
    console.log(`Error when receiving messages from the session ${sessionId}: `, err);
  } else {
    console.log(`Error when creating the receiver for next available session`, err);
  }
}

// Called if we are closing a session.
// `reason` will be:
// * 'error' if we are closing because of an error(the error will be delivered
//   to `processError` above)
// * 'idle_timeout' if `sessionIdleTimeoutMs` milliseconds pass without
//   any messages being received (ie, session can be considered empty).
// NOTE: This function is used only in the sample and is not part of the Service Bus library.
async function sessionClosed(reason: "error" | "idle_timeout", sessionId: string) {
  console.log(`[${sessionId}] was closed because of ${reason}`);
}

// utility function to create a timer that can be refreshed
function createRefreshableTimer(timeoutMs: number, resolve: Function): () => void {
  let timer: any;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('------------session fully read resolve -----');
      resolve()
    }, timeoutMs);
  };
}

// Queries Service Bus for the next available session and processes it.
async function receiveFromNextSession(serviceBusClient: ServiceBusClient): Promise<void> {
  console.log(`------enter receiveFromNextSession function-------\n`);

  let sessionReceiver: ServiceBusSessionReceiver;

  try {
    sessionReceiver = await serviceBusClient.acceptNextSession(topicName, subscriptionName,{
      maxAutoLockRenewalDurationInMs: 0,
    });

  } catch (err) {
    console.log('--------------session receiver create error-----', (<Error>err).message);
    if (
      isServiceBusError(err) &&
      (err.code === "SessionCannotBeLocked" || err.code === "ServiceTimeout")
    ) {
      console.log(`INFO: no available sessions, sleeping for ${delayOnErrorMs}`);
    } else {
      await processError(<Error>err, undefined);
    }

    await delay(delayOnErrorMs);
    return;
  }

  // only ocnsole log function
  await sessionAccepted(sessionReceiver.sessionId);

  const sessionFullyRead = new Promise(async (resolveSessionAsFullyRead, rejectSessionWithError) => {
    console.log(`\n------enter sessionFullyRead function-------\n`);

    const refreshTimer = createRefreshableTimer(sessionIdleTimeoutMs, resolveSessionAsFullyRead);
    refreshTimer();

    sessionReceiver.subscribe(
      {
        async processMessage(msg) {
          refreshTimer();
          await processMessage(msg);
        },
        async processError(args) {
          rejectSessionWithError(args.error);
        },
      },
      // {
      //   abortSignal: abortController.signal,
      // }
    );

    await delay(1000);
    resolveSessionAsFullyRead(`----sessionReceiver.sessionId ${sessionReceiver.sessionId} set to resolved -----`);
  });

  try {
    await sessionFullyRead;
    await sessionClosed("idle_timeout", sessionReceiver.sessionId);
  } catch (err) {
    await processError(<Error>err, sessionReceiver.sessionId);
    await sessionClosed("error", sessionReceiver.sessionId);
  } finally {
    await sessionReceiver.close();
  }
}

async function roundRobinThroughAvailableSessions(): Promise<void> {
  const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);

  const receiverPromises: Promise<void>[] = [];

  for (let i = 0; i < maxSessionsToProcessSimultaneously; ++i) {
    receiverPromises.push(
      (async () => {
        // while (!abortController.signal.aborted) {
          await receiveFromNextSession(serviceBusClient);
        // }
      })()
    );
  }

  console.log('----------', receiverPromises);

  console.log(`Listening for available sessions...\n`);
  await Promise.all(receiverPromises);

  await serviceBusClient.close();
  console.log(`Exiting...`);
}

// To stop the round-robin processing you can just call abortController.abort()
roundRobinThroughAvailableSessions().catch((err) =>
  console.log(`Session RoundRobin - Fatal error: ${err}`)
);
