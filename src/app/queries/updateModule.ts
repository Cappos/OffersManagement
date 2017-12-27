import gql from 'graphql-tag';

export default gql`
    mutation UpdateModule($id: ID!, $name: String!, $bodytext: String!, $price: Float, $groupId: ID, $categoryId: ID) {
        editModule(id: $id, name: $name, bodytext: $bodytext, price: $price, groupId: $groupId, categoryId: $categoryId){
            name
        }
    }
`;

