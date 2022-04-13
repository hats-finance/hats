import { toggleNotification } from "actions";
import { NotificationType } from "constants/constants";
import { useDispatch } from "react-redux";

export const useNotification = () => {
    const dispatch = useDispatch()

    return {
        toggleNotification: (show: boolean, notificationType: NotificationType | undefined, text: string, disableAutoHide?: boolean) => {
            dispatch(toggleNotification(show, notificationType, text, disableAutoHide))
        }
    }
}