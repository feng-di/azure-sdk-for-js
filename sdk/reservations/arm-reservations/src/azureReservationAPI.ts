/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreClient from "@azure/core-client";
import * as coreRestPipeline from "@azure/core-rest-pipeline";
import * as coreAuth from "@azure/core-auth";
import {
  ReservationImpl,
  ReservationOrderImpl,
  OperationImpl,
  CalculateExchangeImpl,
  ExchangeImpl,
  QuotaImpl,
  QuotaRequestStatusImpl
} from "./operations";
import {
  Reservation,
  ReservationOrder,
  Operation,
  CalculateExchange,
  Exchange,
  Quota,
  QuotaRequestStatus
} from "./operationsInterfaces";
import * as Parameters from "./models/parameters";
import * as Mappers from "./models/mappers";
import {
  AzureReservationAPIOptionalParams,
  GetCatalogOptionalParams,
  GetCatalogResponse,
  GetAppliedReservationListOptionalParams,
  GetAppliedReservationListResponse
} from "./models";

export class AzureReservationAPI extends coreClient.ServiceClient {
  $host: string;

  /**
   * Initializes a new instance of the AzureReservationAPI class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param options The parameter options
   */
  constructor(
    credentials: coreAuth.TokenCredential,
    options?: AzureReservationAPIOptionalParams
  ) {
    if (credentials === undefined) {
      throw new Error("'credentials' cannot be null");
    }

    // Initializing default values for options
    if (!options) {
      options = {};
    }
    const defaults: AzureReservationAPIOptionalParams = {
      requestContentType: "application/json; charset=utf-8",
      credential: credentials
    };

    const packageDetails = `azsdk-js-arm-reservations/7.1.0`;
    const userAgentPrefix =
      options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}`
        : `${packageDetails}`;

    if (!options.credentialScopes) {
      options.credentialScopes = ["https://management.azure.com/.default"];
    }
    const optionsWithDefaults = {
      ...defaults,
      ...options,
      userAgentOptions: {
        userAgentPrefix
      },
      baseUri:
        options.endpoint ?? options.baseUri ?? "https://management.azure.com"
    };
    super(optionsWithDefaults);

    if (options?.pipeline && options.pipeline.getOrderedPolicies().length > 0) {
      const pipelinePolicies: coreRestPipeline.PipelinePolicy[] = options.pipeline.getOrderedPolicies();
      const bearerTokenAuthenticationPolicyFound = pipelinePolicies.some(
        (pipelinePolicy) =>
          pipelinePolicy.name ===
          coreRestPipeline.bearerTokenAuthenticationPolicyName
      );
      if (!bearerTokenAuthenticationPolicyFound) {
        this.pipeline.removePolicy({
          name: coreRestPipeline.bearerTokenAuthenticationPolicyName
        });
        this.pipeline.addPolicy(
          coreRestPipeline.bearerTokenAuthenticationPolicy({
            scopes: `${optionsWithDefaults.baseUri}/.default`,
            challengeCallbacks: {
              authorizeRequestOnChallenge:
                coreClient.authorizeRequestOnClaimChallenge
            }
          })
        );
      }
    }

    // Assigning values to Constant parameters
    this.$host = options.$host || "https://management.azure.com";
    this.reservation = new ReservationImpl(this);
    this.reservationOrder = new ReservationOrderImpl(this);
    this.operation = new OperationImpl(this);
    this.calculateExchange = new CalculateExchangeImpl(this);
    this.exchange = new ExchangeImpl(this);
    this.quota = new QuotaImpl(this);
    this.quotaRequestStatus = new QuotaRequestStatusImpl(this);
  }

  /**
   * Get the regions and skus that are available for RI purchase for the specified Azure subscription.
   * @param subscriptionId Id of the subscription
   * @param options The options parameters.
   */
  getCatalog(
    subscriptionId: string,
    options?: GetCatalogOptionalParams
  ): Promise<GetCatalogResponse> {
    return this.sendOperationRequest(
      { subscriptionId, options },
      getCatalogOperationSpec
    );
  }

  /**
   * Get applicable `Reservation`s that are applied to this subscription or a resource group under this
   * subscription.
   * @param subscriptionId Id of the subscription
   * @param options The options parameters.
   */
  getAppliedReservationList(
    subscriptionId: string,
    options?: GetAppliedReservationListOptionalParams
  ): Promise<GetAppliedReservationListResponse> {
    return this.sendOperationRequest(
      { subscriptionId, options },
      getAppliedReservationListOperationSpec
    );
  }

  reservation: Reservation;
  reservationOrder: ReservationOrder;
  operation: Operation;
  calculateExchange: CalculateExchange;
  exchange: Exchange;
  quota: Quota;
  quotaRequestStatus: QuotaRequestStatus;
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getCatalogOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/providers/Microsoft.Capacity/catalogs",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: {
        type: {
          name: "Sequence",
          element: { type: { name: "Composite", className: "Catalog" } }
        }
      }
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [
    Parameters.apiVersion,
    Parameters.reservedResourceType,
    Parameters.location,
    Parameters.publisherId,
    Parameters.offerId,
    Parameters.planId
  ],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const getAppliedReservationListOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.Capacity/appliedReservations",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.AppliedReservations
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
