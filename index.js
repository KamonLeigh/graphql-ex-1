const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type Book {
        title: String
        author: String
        releaseDate: String
        rating: Int
    }

    type Query {
        books: [Book]
    }
`;


const books = [{
    title: 'The Death of Ivan Llyich and Other Stories',
    author: 'Leo Tolstoy',
    releaseDate: '17-05-1886',
    rating: 5
},
{
    title: 'Nothing is True and Everything is Possible',
    author: 'Peter Pomerantsev',
    releaseDate: '01-01-2015',
    rating: 5
},
{
    title: 'The Lean Startup',
    author: 'Eric Ries',
    releaseDate: '01-05-2018',
    rating: 3
}

]

const resolvers = {
    Query: {
        books: () => {
            return books;
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`Server started on ${url}`);
});