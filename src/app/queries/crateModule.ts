import gql from 'graphql-tag';

export default gql`
    mutation AddModule($name: String!, $bodytext: String!, $price: Float!, $groupId: ID, $categoryId: ID) {
        addModule(name: $name, bodytext: $bodytext, price: $price, groupId: $groupId, categoryId: $categoryId ){
            _id
            name
        }
    }
`;
