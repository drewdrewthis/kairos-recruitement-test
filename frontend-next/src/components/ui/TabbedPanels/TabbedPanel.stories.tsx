import type { Meta, StoryObj } from "@storybook/react";
import TabbedPabel from ".";
import { Inter } from "next/font/google";

const meta: Meta<typeof TabbedPabel> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/TabbedPabel",
  component: TabbedPabel,
};

export default meta;
type Story = StoryObj<typeof TabbedPabel>;

const inter = Inter({ subsets: ["latin"] });
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Example: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <div className={inter.className}>
      <TabbedPabel
        panels={[
          {
            label: "Dashboard",
            content: <div>Dashboard</div>,
          },
          {
            label: "Transactions",
            content: <div>Transactions</div>,
          },
          {
            label: "Reports",
            content: <div>Reports</div>,
          },
        ]}
      />
    </div>
  ),
};
