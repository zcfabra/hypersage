import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { prisma } from "../../server/db/client";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD', "OPTIONS"],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: (arg0: any, arg1: any, arg2:any)=>any 
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Run the middleware
    await runMiddleware(req, res, cors);
    console.log("******",req.body);
    const json = JSON.parse(req.body)
    const unpack =json["data"];
    const taskID = json["taskID"];

    // console.log(unpack, taskID)

    const addToTask = await prisma.task.update({
        where:{
            id: taskID,
        },
        data: {
            taskData: unpack

        }
    })

    // Rest of the API logic
    res.json({ message: 'Hello Everyone!' })
}