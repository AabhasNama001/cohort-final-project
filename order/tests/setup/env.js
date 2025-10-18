process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://localhost:27017/test-db-skip-real";
process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "b62e428aa2cb67c779375968e700424993f00c1c4568de057ef6b9ff1f7221c1";
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";
