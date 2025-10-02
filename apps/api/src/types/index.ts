export type JWTPayload = {
  userId: string;
  email: string;
};

export type Variables = {
  jwtPayload: JWTPayload;
};

export type Env = {
  Variables: Variables;
};
