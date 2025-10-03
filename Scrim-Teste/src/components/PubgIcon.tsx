import PubgIconSvg from "../assets/icons/pubg-icon.svg";

const PubgIcon: React.FC<{ className?: string }> = ({ className }) => {
  return <img src={PubgIconSvg} alt="PUBG Icon" className={className} />;
};

export default PubgIcon;
