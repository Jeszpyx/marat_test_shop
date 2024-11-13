import { log } from "console";
import { existsSync, mkdir } from "fs";
import { readdir, stat, readFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { dbPool } from "./client";


const pathToMigrations = join(cwd(), 'migrations')

if (!existsSync(pathToMigrations)) {
    mkdir(pathToMigrations, { recursive: true }, () => { })
}


const migrate = async () => {
    const client = await dbPool.connect()
    try {
        const migrationsFiles = await readdir(pathToMigrations)
        const filesWithStats = await Promise.all(
            migrationsFiles.map(async (file: string) => {
                const fullPath = join(pathToMigrations, file);
                const fileStat = await stat(fullPath);
                return { name: file, createdAt: fileStat.birthtime }
            })
        )
        const lastMigrate = filesWithStats.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)).pop()
        if (!lastMigrate) return
        const sqlBuffer = await readFile(join(pathToMigrations, lastMigrate.name))
        const sqlString = await sqlBuffer.toString()
        await client.query('BEGIN')
        await client.query(sqlString)
        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK')
        throw (`Error in migration: ${error}`)
    } finally {
        client.release()
        log('Migration OK')
        process.exit(1)
    }

}

migrate()