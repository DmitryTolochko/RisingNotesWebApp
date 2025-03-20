import placeholder from '../Images/image-placeholder/user_logo_small_placeholder.png';
import { axiosPictures } from '../Components/App/App';

export async function getUserLogo(userId) {
    let avatar = undefined;
    let response = await axiosPictures.get('api/user/' + userId + '/logo/link')
    .catch(err => {avatar = placeholder});
    if (response) {
        avatar = response?.data?.presignedLink;
    }
    return avatar;
}