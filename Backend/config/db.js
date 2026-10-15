import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;

// Creates a SQL Connection using our env variables
export const sql = neon(
    `postgresql://${PGUSER}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

// SQL function used as a tagged template literal
// which allows us to write SQL safely
