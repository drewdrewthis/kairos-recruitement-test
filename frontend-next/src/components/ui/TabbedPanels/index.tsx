import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface Props {
  className?: string;
  panels: {
    label: string;
    content: React.ReactNode;
  }[];
}

/**
 * Tabbed panels.
 * Based off of MUI: https://mui.com/material-ui/react-tabs/
 * @returns
 */
export default function TabbedPanels(props: Props) {
  const { panels } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
          className="w-full"
          classes={{
            indicator: "bg-primary-300",
          }}
          centered
        >
          {panels.map((panel, idx) => {
            return (
              <Tab
                className="w-full"
                key={panel.label + idx}
                label={panel.label}
                {...a11yProps(0)}
              />
            );
          })}
        </Tabs>
      </Box>
      {panels.map((panel, idx) => {
        return (
          <TabPanel value={value} index={idx} key={panel.label + idx}>
            {panel.content}
          </TabPanel>
        );
      })}
    </Box>
  );
}
