export type ddbQueryPostsParams = {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeNames: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
  FilterExpression?: string;
  ReturnConsumedCapacity?: "INDEXES" | "TOTAL" | "NONE";
  ScanIndexForward?: boolean;
};
