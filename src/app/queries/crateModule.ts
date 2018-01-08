import gql from 'graphql-tag';

export default gql`
    mutation AddModule($name: String!, $bodytext: String!, $price: Float!, $groupId: ID, $categoryId: ID, $defaultModule: Boolean) {
        addModule(name: $name, bodytext: $bodytext, price: $price, groupId: $groupId, categoryId: $categoryId, defaultModule: $defaultModule ){
            _id
            name
        }
    }
`;
