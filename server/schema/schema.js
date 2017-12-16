const graphql = require('graphql');
const mongoose = require('mongoose');
const Book = mongoose.model('Book');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} = graphql;



const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        _id: {type: GraphQLID},
        title: {type: GraphQLString},
        author: {type: GraphQLString},
        category: {type: GraphQLString}
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {_id: {type: GraphQLID}},
            resolve(parentValue, {_id}){
                console.log({_id});
                return Book.findById(_id);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                _id: {type: GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                author: {type: new GraphQLNonNull(GraphQLString)},
                category: {type: GraphQLString}
            },
            resolve(parentValue, {title, author, category}){
                console.log(title, author, category);
                return (new Book({title, author, category})).save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
  });