import express from "express"
import { get, merge } from "lodash"

import { getUserBySessionToken } from "../db/users"

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params
    const currentId = get(req, "identity._id") as string

    if (!currentId) {
      return res.sendStatus(401)
    }

    if (id !== currentId.toString()) {
      return res.sendStatus(403)
    }

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies["auth-cookie"]

    if (!sessionToken) {
      return res.sendStatus(401)
    }

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser) {
      return res.sendStatus(401)
    }

    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
