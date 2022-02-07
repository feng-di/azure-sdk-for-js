// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT Licence.

/**
 * This sample demonstrates how to send/receive messages to/from session enabled queues/subscriptions
 * in Service Bus.
 *
 * Setup: To run this sample, you would need session enabled Queue/Subscription.
 *
 * See https://docs.microsoft.com/azure/service-bus-messaging/message-sessions to learn about
 * sessions in Service Bus.
 *
 * @summary Demonstrates how to send/receive messages to/from session enabled queues/subscriptions
 * in Service Bus
 */

import { delay, ProcessErrorArgs, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";

// Load the .env file if it exists
import * as dotenv from "dotenv";
import * as uuid from 'uuid';

dotenv.config();

// Define connection string and related Service Bus entity names here
// Ensure on portal.azure.com that queue/topic has Sessions feature enabled
const connectionString = process.env.SERVICEBUS_CONNECTION_STRING || "<connection string>";
const topicName = process.env.TOPIC_NAME_WITH_SESSIONS || "<queue name>";
const subscriptionName = process.env.SUBSCRIPTION_NAME || "<subscription name>";

console.log('------Environment variable------\n', connectionString, '\n', topicName, '\n', subscriptionName, '\n---------------');

const listOfScientists = [
  { lastName: "Einstein", firstName: "Albert" },
  { lastName: "Heisenberg", firstName: "Werner" },
  { lastName: "Curie", firstName: "Marie" },
  { lastName: "Hawking", firstName: "Steven" },
  { lastName: "Newton", firstName: "Isaac" },
  { lastName: "Bohr", firstName: "Niels" },
  { lastName: "Faraday", firstName: "Michael" },
  { lastName: "Galilei", firstName: "Galileo" },
  { lastName: "Kepler", firstName: "Johannes" },
  { lastName: "Kopernikus", firstName: "Nikolaus" },
];

export async function main() {
  const sbClient = new ServiceBusClient(connectionString);

  try {
    console.log(`\nSending 10 messages to random session\n`);
    await sendMessage(sbClient, listOfScientists[0]);
    // await sendMessage(sbClient, listOfScientists[1]);
    // await sendMessage(sbClient, listOfScientists[2]);

    // console.log(`\nSending 5 messages to 'session-1'\n`);
    // await sendMessage(sbClient, listOfScientists[0], "session-1");
    // await sendMessage(sbClient, listOfScientists[1], "session-1");
    // await sendMessage(sbClient, listOfScientists[2], "session-1");
    // await sendMessage(sbClient, listOfScientists[3], "session-1");
    // await sendMessage(sbClient, listOfScientists[4], "session-1");
    //
    // console.log(`\nSending 5 messages to 'session-2'\n`);
    // await sendMessage(sbClient, listOfScientists[5], "session-2");
    // await sendMessage(sbClient, listOfScientists[6], "session-2");
    // await sendMessage(sbClient, listOfScientists[7], "session-2");
    // await sendMessage(sbClient, listOfScientists[8], "session-2");
    // await sendMessage(sbClient, listOfScientists[9], "session-2");
    //
    // console.log(`\nSending 10 messages to random session\n`);
    // await sendMessage(sbClient, listOfScientists[0]);
    // await sendMessage(sbClient, listOfScientists[1]);
    // await sendMessage(sbClient, listOfScientists[2]);
    // await sendMessage(sbClient, listOfScientists[3]);
    // await sendMessage(sbClient, listOfScientists[4]);
    // await sendMessage(sbClient, listOfScientists[5]);
    // await sendMessage(sbClient, listOfScientists[6]);
    // await sendMessage(sbClient, listOfScientists[7]);
    // await sendMessage(sbClient, listOfScientists[8]);
    // await sendMessage(sbClient, listOfScientists[9]);

    if(process.argv[2] === 'withReceive'){
      await receiveMessages(sbClient, "session-1");
      await receiveMessages(sbClient, "session-2");
    }
  } finally {
    await sbClient.close();
  }
}

async function sendMessage(sbClient: ServiceBusClient, scientist: any, sessionId?: string) {
  // createSender() also works with topics
  const sender = sbClient.createSender(topicName);

  if (!sessionId) {
    sessionId = uuid.v4();
  }

  const message: ServiceBusMessage = {
    body: `${scientist.firstName} ${scientist.lastName}`,
    subject: "Scientist",
    sessionId: sessionId,
    messageId: uuid.v4(),
  };

  console.log(`Sending message: "${message.body}" to "${sessionId}"`);
  await sender.sendMessages(message);

  await sender.close();
}

async function receiveMessages(sbClient: ServiceBusClient, sessionId: string) {
  // If receiving from a subscription you can use the acceptSession(topic, subscription, sessionId) overload
  let endDate: number | undefined;

  while (true) {
    console.log(`\n---- Creating session receiver for session '${sessionId}'`);
    const receiver = await sbClient.acceptSession(topicName, subscriptionName, sessionId);

    const subscribePromise = new Promise((_, reject) => {
      const processMessage = async (message: ServiceBusMessage) => {
        console.log(`Received: ${message.sessionId} - ${message.body} \n`);
      };
      const processError = async (args: ProcessErrorArgs) => {
        console.log(`>>>>> Error from error source ${args.errorSource} occurred: `, args.error);
        reject(args.error);
      };

      receiver.subscribe({
        processMessage,
        processError,
      });
    });

    const now = Date.now();

    if (endDate == null) {
      endDate = now + 2 * 1000;
    }

    let remainingTime: number = endDate - now;

    console.log(`Waiting for ${remainingTime} milliseconds for messages to arrive.`);

    try {
      await Promise.race([subscribePromise, delay(remainingTime)]);

      // wait time has expired, we can stop listening.
      console.log(`Time has expired, closing receiver for session '${sessionId}'`);

      await receiver.close();
      break;
    } catch (err) {
      // `err` was already logged part of `processError` above.
      await receiver.close();
    }
  }
}

main().catch((err) => {
  console.log("Session Sample - Error occurred: ", err);
  process.exit(1);
});
