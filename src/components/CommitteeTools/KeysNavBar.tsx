import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { RoutePaths } from "../../constants/constants";
import { IStoredKey } from "../../types/types";
import ArrowIcon from '../../assets//icons/arrow.icon'
import LockIcon from '../../assets//icons/lock.icon'
import PlusIcon from '../../assets//icons/plus.icon'

interface IProps {
    keys: IStoredKey[]
    selected?: string
}

export default function KeysSidebar({ keys }: IProps) {
    return <div className={classNames({ 'keys-navbar': true })}>
        <div className="keys-navbar-header">
            <ArrowIcon />
            <p>Stored keys</p>
        </div>
        {
            keys && keys.map((storedKey) =>
                <NavLink
                    key={storedKey.alias}
                    className="nav-link"
                    to={`${RoutePaths.committee_tools}/${storedKey.alias}`}
                    activeClassName="selected">
                    <LockIcon width="16px" height="21px" />
                    <p>{storedKey.alias}</p>
                </NavLink>
            )
        }
        <NavLink
            exact
            className="nav-link"
            to={`${RoutePaths.committee_tools}`}
            activeClassName="selected">
                <PlusIcon />
                <p>New</p>
            </NavLink>
    </div >
}