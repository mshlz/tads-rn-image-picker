import { Database } from "../db/Database"
import { Book } from "../models/Book"
import StorageService from "./StorageService"

export class BookService {
    static readonly TABLE = `book`

    static async create(obj: Book) {
        if (obj.imageUri) {
            const imageUri = await StorageService.saveFile(obj.imageUri)
            obj.imageUri = imageUri
        }

        const result = await Database.runQuery(`INSERT INTO ${this.TABLE} (name, author, description, publisher, imageUri) VALUES (?,?,?,?,?)`, [
            obj.name.trim(),
            obj.author.trim(),
            obj.description.trim(),
            obj.publisher.trim(),
            obj.imageUri,
        ])

        obj.id = result.insertId

        return obj
    }

    static async update(obj: Book) {
        if (obj.imageUri) {
            const original = await this.findById(obj.id)
            if (obj.imageUri != original.imageUri) {
                const imageUri = await StorageService.saveFile(obj.imageUri)
                obj.imageUri = imageUri
            }
        }

        const query = `UPDATE ${this.TABLE} SET name = ?, author = ?, description = ?, publisher = ?, imageUri = ? WHERE id = ?;`
        const result = await Database.runQuery(query, [
            obj.name.trim(),
            obj.author.trim(),
            obj.description.trim(),
            obj.publisher.trim(),
            obj.imageUri,
            obj.id
        ])

        return result.rowsAffected > 0
    }

    static async delete(obj: Book) {
        await this.tryRemoveImage(obj.id)

        const query = `DELETE FROM ${this.TABLE} WHERE id = ?;`
        const result = await Database.runQuery(query, [
            obj.id
        ])

        return result.rowsAffected > 0
    }

    static async deleteById(id: number) {
        await this.tryRemoveImage(id)

        const query = `DELETE FROM ${this.TABLE} WHERE id = ?;`
        const result = await Database.runQuery(query, [id])

        return result.rowsAffected > 0
    }

    static async tryRemoveImage(id: number) {
        try {
            const obj = await this.findById(id)
            await StorageService.deleteFile(obj.imageUri)
        } catch (e) {}
    }

    static async findById(id: number) {
        const query = `SELECT * FROM ${this.TABLE} WHERE id = ?;`
        const result = await Database.runQuery(query, [id])

        if (result.rows.length != 1) {
            throw new Error('Book not found')
        }

        const raw = result.rows.item(0)
        const obj = new Book(raw)

        return obj
    }

    static async findAll() {
        const query = `SELECT * FROM ${this.TABLE};`
        const result = await Database.runQuery(query)

        return result.rows._array.map(row => new Book(row))
    }

}