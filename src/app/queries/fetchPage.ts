import gql from 'graphql-tag';

export default gql`
    query fetchPage( $id: ID!){
        page (id: $id){
            _id
            type
            title
            subtitle
            bodytext
            tstamp
        }
    }
`;
