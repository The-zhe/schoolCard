
import store from '@/store'

export const getAuthorization = () => {
    const header = {
        "Authorization": `Bearer ${store.state.user.access_token}`,
    }
    return header;
}