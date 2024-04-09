export const config = {
  //HASURA
  hasuraEndpoint: process.env.HASURA_ENDPOINT!,
  hasuraToothFairySecret: process.env.HASURA_TOOTHFAIRY_SECRET!,
  hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET!,
  //CLOUDINARY
  cloudCloudName: process.env.CLOUD_NAME,
  cloudinaryApiKey: process.env.API_KEY,
  apiApiSecret: process.env.API_SECRET,
  // MISC
  jwtSecret: process.env.JWT_SECRET,
  passwordSalt: process.env.PASSWORD_SALT!,
};
