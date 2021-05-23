import { array, object, string } from "yup"

const assetCollectionSchema = array(
  object({
    id: string().required(),
    token_id: string().required(),
    image_url: string().required(),
    name: string().required(),
    asset_contract: object({
      address: string().required(),
    }).nullable(),
  })
).required()

const assetSchema = object({
  id: string().required(),
  name: string().required(),
  description: string().nullable(),
  image_url: string().required(),
  collection: object({
    name: string().required(),
  }),
  permalink: string().required(),
}).required()

export { assetCollectionSchema, assetSchema }
