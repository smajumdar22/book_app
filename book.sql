DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    authors VARCHAR(80),
    title text,
    isbn varchar(30),
    image_url text,
    description_book text
    -- bookshelf text
);

INSERT INTO books (authors,title,isbn,image_url,description_book)
VALUES ('Roland Mushat Frye', 'Shakespeare','ISBN_10 0195160932','http://books.google.com/books/content?id=XMrZrA1vomQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api','Looks at the life, career, works, and influence of William Shakespeare.'),
('Stanley W. Wells', 'Shakespeare','ISBN_10 0415352894','http://books.google.com/books/content?id=sE_vuDVQwNkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api','Introduction; Part I: Theory And Practice; Part II: Culture And Tradition; Part III: Text And Ideology; Part IV: Stage And Spectacle; Afterword; Select bibliography; Index.');
