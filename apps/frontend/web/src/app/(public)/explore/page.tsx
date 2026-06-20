"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { NewsItem, TrendingItem } from "../../../components/explore/types";
import { NEWS_DATA, TRENDING_DATA } from "@/components/explore/constant";
import Header from "@/components/explore/explore.header";
import TabsNavigation from "@/components/explore/explore.tabs";
import NewsCard from "@/components/explore/explore.news";
import TrendingCard from "@/components/explore/explore.trending";
import { List } from "@mui/material";

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box width={"100%"}>
      <div className="w-full">
        <Header />
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <Divider className="my-0" />

        <Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" className="font-bold mb-4">
              Today's News
            </Typography>
          </Box>
          <List disablePadding className="w-full">
            {NEWS_DATA.map((news: NewsItem) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </List>
        </Box>

        <Divider className="my-0" />

        <Box>
          <List disablePadding className="w-full">
            {TRENDING_DATA.map((trending: TrendingItem, index: number) => (
              <React.Fragment key={trending.id}>
                <TrendingCard trending={trending} />
                {index < TRENDING_DATA.length - 1 && (
                  <Divider className="my-0" />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </div>
    </Box>
  );
}
