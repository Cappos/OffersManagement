import gql from 'graphql-tag';

export default gql`
    query fetchModule( $id: ID!){
        module(id: $id){
            _id
            name
            bodytext
            price
            tstamp
            groupId {
                _id
                name
                value
            }
            categoryId {
                _id
                name
                value
            }
            moduleNew
        }
        
        categories {
            _id
            name
            value
        }
    }
`;
