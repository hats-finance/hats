import { useContext } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import useModal from "hooks/useModal";
import DeleteIcon from "assets/icons/delete.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import { KeystoreContext } from "../../store";
import { IStoredKey } from "../../types";
import { StyledExistentKeyCard } from "./styles";
import { KeyDetailsModal, KeyDeleteModal } from "components/Keystore";

type KeyRowProps = {
  keypair: IStoredKey;
  onSelect: () => void;
};

const ExistentKeyCard = ({ keypair, onSelect }: KeyRowProps) => {
  const keystoreContext = useContext(KeystoreContext);

  const { isShowing: isShowingKeyDetails, show: showKeyDetails, hide: hideKeyDetails } = useModal();
  const { isShowing: isShowingKeyDelete, show: showKeyDelete, hide: hideKeyDelete } = useModal();

  const selected = keypair.alias === keystoreContext.selectedKey?.alias;

  return (
    <StyledExistentKeyCard key={keypair.alias}>
      <p
        className="title"
        onClick={() => {
          keystoreContext.setSelectedAlias(keypair.alias);
          onSelect();
        }}>
        <div className={classNames({ "fish-eye": true, selected })} />
        <span>{keypair.alias}</span>
      </p>
      <p className="copy" onClick={showKeyDetails}>
        <img src={CopyIcon} alt="display" />
      </p>
      <p className="delete" onClick={showKeyDelete}>
        <img src={DeleteIcon} alt="delete" />
      </p>

      <KeyDetailsModal keyToShow={keypair} isShowing={isShowingKeyDetails} onHide={hideKeyDetails} />
      <KeyDeleteModal keyToDelete={keypair} isShowing={isShowingKeyDelete} onHide={hideKeyDelete} />
    </StyledExistentKeyCard>
  );
};

export { ExistentKeyCard };
