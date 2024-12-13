import { Router } from "express";
import { booksController } from "./book.controller.js";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { createApiResponse } from "../../api-docs/openAPIResponseBuilders.js";
import {
  bookSchema,
  getBookSchema,
  createBookSchema,
  updateBookSchema,
} from "./book.model.js";

export const booksRouter = Router();
export const booksRegistry = new OpenAPIRegistry();

booksRegistry.register("Book", bookSchema);


booksRegistry.registerPath({
  method: "post",
  path: "/book",
  tags: ["Books"],
  request: {
    body: {
      description: "Create a new book",
      required: true,
      content: {
        "application/json": {
          schema: createBookSchema,
        },
      },
    },
  },
  responses: {
    ...createApiResponse(bookSchema, "Book created successfully", 201),
  },
});
booksRouter.post("/book", booksController.createBook);


const createBooksBulkSchema = z.object({
  books: z.array(createBookSchema),
});
booksRegistry.registerPath({
  method: "post",
  path: "/books/bulk",
  tags: ["Books"],
  request: {
    body: {
      description: "Bulk create multiple books",
      required: true,
      content: {
        "application/json": {
          schema: createBooksBulkSchema,
        },
      },
    },
  },
  responses: {
    ...createApiResponse(z.array(bookSchema), "Books created successfully", 201),
  },
});
booksRouter.post("/books/bulk", booksController.createBooksBulk);


booksRegistry.registerPath({
  method: "get",
  path: "/book/{id}",
  tags: ["Books"],
  request: {
    params: getBookSchema.shape.params,
  },
  responses: {
    ...createApiResponse(bookSchema, "Book fetched successfully"),
  },
});
booksRouter.get("/book/:id", booksController.getBook);


booksRegistry.registerPath({
  method: "patch",
  path: "/book/{id}",
  tags: ["Books"],
  request: {
    params: getBookSchema.shape.params,
    body: {
      description: "Partial update of a book",
      required: true,
      content: {
        "application/json": {
          schema: updateBookSchema,
        },
      },
    },
  },
  responses: {
    ...createApiResponse(bookSchema, "Book updated successfully"),
  },
});
booksRouter.patch("/book/:id", booksController.updateBook);


booksRegistry.registerPath({
  method: "delete",
  path: "/book/{id}",
  tags: ["Books"],
  request: { params: getBookSchema.shape.params },
  responses: {
    204: {
      description: "Book deleted successfully",
    },
    404: {
      description: "Book not found",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});
booksRouter.delete("/book/:id", booksController.deleteBook);


const listBooksQuerySchema = z.object({
  title: z.string().optional(),
  isbn: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  publishedYear: z.number().optional(),
});

booksRegistry.registerPath({
  method: "get",
  path: "/books",
  tags: ["Books"],
  request: { query: listBooksQuerySchema },
  responses: {
    ...createApiResponse(z.array(bookSchema), "Books fetched successfully"),
  },
});
booksRouter.get("/books", booksController.getBooks);


const searchBooksQuerySchema = z.object({
  search: z.string(),
});

booksRegistry.registerPath({
  method: "get",
  path: "/books/search",
  tags: ["Books"],
  request: { query: searchBooksQuerySchema },
  responses: {
    ...createApiResponse(z.array(bookSchema), "Books searched successfully"),
  },
});
booksRouter.get("/books/search", booksController.searchBooks);