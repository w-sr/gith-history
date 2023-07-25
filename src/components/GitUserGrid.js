import { Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "avatarUrl",
    headerName: "",
    width: 80,
    renderCell: (params) => {
      return <Avatar src={params.row.avatarUrl} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
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
    field: "login",
    headerName: "Username",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Joined Date",
    width: 120,
  },
  {
    field: "message",
    headerName: "Bio",
    width: 200,
  },
];

const GitUserGrid = ({ data }) => {
  const rows = data.map((item, index) => ({
    id: index,
    name: item.name,
    avatarUrl: item.avatarUrl,
    email: item.email,
    location: item.location,
    login: item.login,
    createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
    message: item.status ? item.status.message : "",
  }));

  return <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />;
};

export default GitUserGrid;
