// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CosmosHeaders } from "../../queryExecutionContext";
import { ResourceResponse } from "../../request/ResourceResponse";
import { CosmosDiagnostics } from "../Diagnostics/Diagnostic";
import { Resource } from "../Resource";
import { Item } from "./Item";
import { ItemDefinition } from "./ItemDefinition";

export class ItemResponse<T extends ItemDefinition> extends ResourceResponse<T & Resource> {
  constructor(
    resource: T & Resource,
    headers: CosmosHeaders,
    statusCode: number,
    subsstatusCode: number,
    item: Item,
    cosmosDiagnostics: CosmosDiagnostics
  ) {
    super(resource, headers, statusCode, subsstatusCode, cosmosDiagnostics);
    this.item = item;
  }
  /** Reference to the {@link Item} the response corresponds to. */
  public readonly item: Item;
}
