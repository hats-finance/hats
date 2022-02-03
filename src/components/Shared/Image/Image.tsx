import { useState } from "react";
import Spinner from "../../../assets/icons/loading.svg";
import classNames from "classnames";
import "./index.scss";

interface IProps {
  source: string;
  alt: string
  className?: string;
}

/**
 * This component is useful when loading an image in an async way.
 * A spinner will be displayed until the image is fully fetched.
 */
export default function Image({ source, alt, className }: IProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <>
      <img
        className={classNames("async-image-spinner", { "show": loading && !error })}
        src={Spinner}
        alt="spinner" />
      <img
        className={classNames("async-image", { "show": !loading }, className)}
        src={source}
        onLoad={() => { setLoading(false); setError(false); }}
        onError={() => setError(true)}
        alt={alt} />
      {error && <span className="async-image-error">Error while loading the image</span>}
    </>
  )
}
