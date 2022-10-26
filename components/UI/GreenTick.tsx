import DoneIcon from "@mui/icons-material/Done";

const GreenTick = ({ message }: { message?: string }) => {
  return (
    <div className="flex label">
      <DoneIcon color="success" fontSize="small"></DoneIcon>
      <div className="flex-content">{message ?? ""}</div>
    </div>
  );
};
export default GreenTick;
