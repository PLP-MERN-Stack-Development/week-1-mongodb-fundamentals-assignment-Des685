// Connect to the 'bookstore' database
use bookstore;

// ========== Task 1: Basic Queries ==========

// 1. Find all books in a specific genre (e.g., 'Science Fiction')
db.books.find(
  { genre: 'Science Fiction' },
  { title: 1, author: 1, price: 1 } // Project only needed fields
);

// 2. Find books published after a certain year (e.g., after 2015)
db.books.find(
  { published_year: { $gt: 2015 } },
  { title: 1, author: 1, price: 1 }
);

// 3. Find all books written by a specific author (e.g., 'George Orwell')
db.books.find(
  { author: 'George Orwell' },
  { title: 1, author: 1, price: 1 }
);

// 4. Update the price of a specific book (e.g., '1984' now costs 199.99)
db.books.updateOne(
  { title: '1984' },
  { $set: { price: 199.99 } }
);

// 5. Delete a book by its title (e.g., 'Outdated Book Title')
db.books.deleteOne(
  { title: 'Outdated Book Title' }
);


// ========== Task 2: Combined & Projection ==========

// 6. Find books that are in stock AND published after 2010
db.books.find(
  {
    in_stock: true,
    published_year: { $gt: 2010 }
  },
  { title: 1, author: 1, price: 1 } // Projection: only return what we need
);


// ========== Task 3: Sorting and Pagination ==========

// 7. Sort books by price in ascending order
db.books.find({}, { title: 1, price: 1 }).sort({ price: 1 });

// 8. Sort books by price in descending order
db.books.find({}, { title: 1, price: 1 }).sort({ price: -1 });

// 9. Paginate results: show page 2 (i.e., skip first 5, limit next 5)
db.books.find({}, { title: 1, author: 1, price: 1 })
  .skip(5)
  .limit(5);


// ========== Task 4: Aggregation Pipelines ==========

// 10. Calculate average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 11. Find the author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      totalBooks: { $sum: 1 }
    }
  },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]);

// 12. Group books by decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: ["$published_year", 0, 3] },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      booksCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// ========== Task 5: Indexing ==========

// 13. Create an index on the title field to speed up search by title
db.books.createIndex({ title: 1 });

// 14. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 15. Use explain() to compare performance (before and after indexing)
// Run a sample query with explain
db.books.find({ title: "1984" }).explain("executionStats");
