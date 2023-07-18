import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  IconButton,
  InputBase,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { extractGitHubInfoFromURL } from "./helper";
import { requestGraphql } from "./utils";
import GitUserGrid from "./components/GitUserGrid";

function App() {
  const [url, setUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchStatics = async () => {
    if (!url) return;

    const git = extractGitHubInfoFromURL(url);

    if (!git) return;

    const { repoName, username } = git;
    setLoading(true);

    try {
      const result = await requestGraphql(username, repoName);
      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          margin: "16px 0",
          width: 400,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Input git repo"
          inputProps={{ "aria-label": "search git users" }}
          onChange={(e) => setUrl(e.target.value)}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={fetchStatics}
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {loading ? (
        <CircularProgress
          sx={{ position: "absolute", top: "50%", right: "50%" }}
        />
      ) : Object.keys(data).length ? (
        <GitUserGrid data={Object.values(data)} />
      ) : (
        <Box>Git repository not found</Box>
      )}
    </Container>
  );
}

export default App;
