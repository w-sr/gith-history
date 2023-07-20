import { Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "avatarUrl",
    headerName: "",
    width: 80,
    renderCell: (params) => {
      return <Avatar src={params.row.avatarUrl} />;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "committedDate",
    headerName: "Last Commit",
    width: 200,
  },
];

const GitUserGrid = ({ data }) => {
  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />;
};

export default GitUserGrid;
