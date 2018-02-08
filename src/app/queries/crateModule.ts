import gql from 'graphql-tag';

export default gql`
    mutation AddModule($name: String!, $bodytext: String!, $price: Float!, $groupId: ID, $categoryId: ID, $defaultModule: Boolean, $internalHours: Int, $externalHours: Int, $pricePerHour: Int) {
        addModule(name: $name, bodytext: $bodytext, price: $price, groupId: $groupId, categoryId: $categoryId, defaultModule: $defaultModule, internalHours: $internalHours, externalHours: $externalHours, pricePerHour: $pricePerHour ){
            _id
            name
        }
    }
`;
