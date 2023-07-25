import { Avatar, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

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
    width: 300,
  },
  {
    field: "createdAt",
    headerName: "Joined Date",
    width: 200,
  },
  {
    field: "lastCommit",
    headerName: "Recent commit",
    width: 200,
  },
  {
    field: "socialAccounts",
    headerName: "Social Accounts",
    width: 200,
    renderCell: (params) => {
      const socialAccounts = params.row.socialAccounts;
      if (socialAccounts.length === 0) {
        return <></>;
      } else {
        return (
          <>
            {socialAccounts.map((account) => {
              const { provider, url } = account;
              switch (provider) {
                case "FACEBOOK": {
                  return (
                    <Link href={url} _target="blank">
                      <FacebookIcon />
                    </Link>
                  );
                }
                case "LINKEDIN": {
                  return (
                    <Link href={url} _target="blank">
                      <LinkedInIcon />
                    </Link>
                  );
                }
                case "TWITTER": {
                  return (
                    <Link href={url} _target="blank">
                      <TwitterIcon />
                    </Link>
                  );
                }
                case "INSTAGRAM": {
                  return (
                    <Link href={url} _target="blank">
                      <InstagramIcon />
                    </Link>
                  );
                }
                default:
                  return <></>;
              }
            })}
          </>
        );
      }
    },
  },
];

const GitUserGrid = ({ data }) => {
  const rows = data.map((item, index) => {
    const comments = item.commitComments.nodes;
    return {
      id: index,
      name: item.name,
      avatarUrl: item.avatarUrl,
      email: item.email,
      location: item.location,
      login: item.login,
      createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
      message: item.status ? item.status.message : "",
      socialAccounts: item.socialAccounts.nodes
        ? item.socialAccounts.nodes
        : [],
      lastCommit: comments.length ? comments[0].createdAt.split("T")[0] : "",
    };
  });

  return <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />;
};

export default GitUserGrid;
