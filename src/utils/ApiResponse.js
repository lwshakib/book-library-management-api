class ApiResponse {
  constructor(
    statusCode,
    data,
    message = "Success",
    pagination = undefined,
    sort = undefined
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.pagination = pagination || undefined;
    this.sort = sort || undefined;
  }
}

export { ApiResponse };
