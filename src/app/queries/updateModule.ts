import gql from 'graphql-tag';

export default gql`
    mutation UpdateModule($id: ID!, $name: String!, $bodytext: String!, $price: Float, $groupId: ID) {
        editModule(id: $id, name: $name, bodytext: $bodytext, price: $price, groupId: $groupId, ){
            name
        }
    }
`;

