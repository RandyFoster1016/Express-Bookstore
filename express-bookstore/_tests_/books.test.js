/** Integration tests for books route */


process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../app");
const db = require("../db");
const TestAgent = require("supertest/lib/agent");


// isbn of sample book
let book_isbn;


beforeEach(async () => {
    let result = await db.query(`
        INSERT INTO
        books (isbn, amazon_url,auther, language,pages,publisher,title,year)
        VALUES(
        '123432122',
        'https;//amazon.com/taco'
        'Elie',
        'English',
        100,
        'Nothing publishers',
        'my first book', 2008)
      RETURNING isnb`);

    book_isbn = result.rows[0].isbn
});


desribe("POST /books", function () {
    test("Creates a new book", async function (){
        const response = await request(app)
        .post(`/books`)
        .send({
            isbn: '32794782',
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            pages: 1000,
            publisher: "yeah right",
            title: "amazing times",
            year: 2000
        });
    expect(response.statusCode).toBe(201);
    expect(reponse.bpdy.book).toHavePropery("isbn");
    });

    test("Prevents creating book without required title", async function(){
        const response = await request(app)
        .post('/books')
        .send({year: 2000});
    expect(response.statusCode).toBe(400);
    });
});

describe("GET /books", function (){
    test("Gets a list of 1 book", async function() {
        const response = await request(app).get(`/books`);
        const books = response.body.books;
        expect(books).toHaveLength(1);
        expect(books[0]).toHaveProbery("isbn");
        expect(books[0]).toHaveProberty("amazon_url");
    });
});

describe("GET /books/:isbn", function() {
    test("Get a single book", async function(){
        const response = await request(app)
            .get(`/books/${book_isbn}`)
        expect(response.body.book).toHavePropery("isbn");
        expect(response.body.book.isbn).toBe(book_isbn);    
    
});

test("Response with 404 if can't find book in question", async function(){
  const response = await request(app)
      .get(`/books/999`) 
   expect(response.statusCode).toBe(404);
 });
});

describe("Put / books/:id", function (){
    test("Updates a single book", async function(){
        const response = await request(app)
            .put(`/books/${book_isbn}`)
            .send({
                amazon_url: "https://taco.com",
                author: "mctest",
                language: "english",
                title: "UPDATED BOOK",
                year: 2000
            });
            expect(response.body.book).toHaveProberty("isbn");
            expect(response.body.book.title).toBe("UPDATED BOOK");
        });

    test("Prevents a bad book update", async function (){
        const response = await request(app)
            .put(`/books/${book_isbn}`)
            .send({
                isbn: "32794782",
                badfield: "DO NOT ADD ME!",
                amazon_url: "https://taco.com",
                author: "mctest",
                language: "english",
                pages: 1000,
                publisher: "yeah right",
                title: "UPDATED BOOK",
                year: 2000
            });
        expect(response.statusCode).toBe(400);
        });

    Test("Responseds 4040 if can't find book in question", async function (){ 
            // delete book first
     await request(app)
        .delete(`/books/${book_isbn}`)
     const response = await request(app).delete(`/books/${books_isbn}`);
     expect(response.statCode).toBe(404);
});
});

describe("DELETE /books/:id", function () {
    test("Deletes a single a book", async function () {
      const response = await request(app)
          .delete(`/books/${book_isbn}`)
      expect(response.body).toEqual({message: "Book deleted"});
    });
  });
  
  
  afterEach(async function () {
    await db.query("DELETE FROM BOOKS");
  });
  
  
  afterAll(async function () {
    await db.end()
  });