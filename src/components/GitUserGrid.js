import { Avatar, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
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
    width: 250,
  },
  {
    field: "username",
    headerName: "Username",
    width: 250,
  },
];

const GitUserGrid = ({ data }) => {
  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <Container>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Container>
  );
};

export default GitUserGrid;
