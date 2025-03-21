import React from "react";
import { Card, CardContent, Typography, Button, List } from "@mui/material";

function GroupList({ groups, onCreateGroup, onGroupClick }) {
	return (
		<div>
			<List>
				{groups.map((group) => (
					<Card
						key={group.id}
						style={{ margin: "10px 0" }}
						onClick={() => onGroupClick(group.id)}
					>
						<CardContent>
							<Typography variant="h5">{group.name}</Typography>
							<Typography variant="body2">
								Root User: {group.root_user}
							</Typography>
						</CardContent>
					</Card>
				))}
			</List>
		</div>
	);
}

export default GroupList;
