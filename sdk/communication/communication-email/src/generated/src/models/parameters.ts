/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  OperationURLParameter,
  OperationQueryParameter,
  OperationParameter
} from "@azure/core-http";
import { EmailMessage as EmailMessageMapper } from "../models/mappers";

export const endpoint: OperationURLParameter = {
  parameterPath: "endpoint",
  mapper: {
    serializedName: "endpoint",
    required: true,
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};

export const messageId: OperationURLParameter = {
  parameterPath: "messageId",
  mapper: {
    serializedName: "messageId",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const apiVersion: OperationQueryParameter = {
  parameterPath: "apiVersion",
  mapper: {
    defaultValue: "2021-10-01-preview",
    isConstant: true,
    serializedName: "api-version",
    type: {
      name: "String"
    }
  }
};

export const contentType: OperationParameter = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};

export const emailMessage: OperationParameter = {
  parameterPath: "emailMessage",
  mapper: EmailMessageMapper
};

export const repeatabilityRequestId: OperationParameter = {
  parameterPath: "repeatabilityRequestId",
  mapper: {
    serializedName: "repeatability-request-id",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const repeatabilityFirstSent: OperationParameter = {
  parameterPath: "repeatabilityFirstSent",
  mapper: {
    serializedName: "repeatability-first-sent",
    required: true,
    type: {
      name: "String"
    }
  }
};
