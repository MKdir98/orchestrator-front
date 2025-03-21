import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, {
	Controls,
	Background,
	useNodesState,
	useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
	Button,
	TextField,
	Box,
	List,
	ListItem,
	ListItemText,
	Typography,
	Paper,
	Modal,
	IconButton,
} from "@mui/material";
import UserScreen from "./UserScreen";
import { DesktopWindows } from "@mui/icons-material"; // آیکون مانیتور

function UserTree({ groupId }) {
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [newChildName, setNewChildName] = useState("");
	const [newChildDescription, setNewChildDescription] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [tasks, setTasks] = useState([]);
	const [openUserScreen, setOpenUserScreen] = useState(false); // حالت نمایش مودال
	const [processData, setProcessData] = useState({
		prompt: "",
		output: "",
	});
	const [showProcessPanel, setShowProcessPanel] = useState(false);

	// حالتهای react-flow
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/groups/${groupId}/users`)
			.then((response) => {
				setUsers(response.data);
				updateGraph(response.data);
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
			});
	}, [groupId]);

	useEffect(() => {
		if (selectedUserId) {
			axios
				.get(`http://localhost:5000/api/users/${selectedUserId}/tasks`)
				.then((response) => {
					setTasks(response.data);
				})
				.catch((error) => {
					console.error("Error fetching tasks:", error);
				});
		}
	}, [selectedUserId]);

	// بهروزرسانی گراف بر اساس دادههای کاربران
	const updateGraph = (users) => {
		const newNodes = users.map((user, index) => ({
			id: user.id.toString(),
			data: { label: user.name },
			position: { x: index * 200, y: user.parent_user_id ? 100 : 0 },
			draggable: true, // قابلیت حرکت گرهها
		}));

		const newEdges = users
			.filter((user) => user.parent_user_id)
			.map((user) => ({
				id: `edge-${user.parent_user_id}-${user.id}`,
				source: user.parent_user_id.toString(),
				target: user.id.toString(),
			}));

		setNodes(newNodes);
		setEdges(newEdges);
	};

	const handleCreateChild = () => {
		if (!selectedUserId || !newChildName) return;

		axios
			.post(`http://localhost:5000/api/users/${selectedUserId}/children`, {
				name: newChildName,
				description: newChildDescription,
				parent_user_id: selectedUserId,
			})
			.then((response) => {
				setUsers((prevUsers) => [...prevUsers, response.data]);
				updateGraph([...users, response.data]);
				setNewChildName("");
				setNewChildDescription("");
			})
			.catch((error) => {
				console.error("Error creating child user:", error);
			});
	};

	const handleAssignTask = () => {
		if (!selectedUserId || !taskDescription) return;

		axios
			.post(`http://localhost:5000/api/users/${selectedUserId}/tasks`, {
				description: taskDescription,
			})
			.then((response) => {
				setTasks((prevTasks) => [...prevTasks, response.data]);
				setTaskDescription("");
			})
			.catch((error) => {
				console.error("Error assigning task:", error);
			});
	};

	const handleProcess = async () => {
		if (!selectedUserId) return;

		try {
			const response = await axios.post(
				`http://localhost:5000/api/users/${selectedUserId}/process_tasks`,
			);
			setProcessData({
				prompt: response.data.prompt,
				output: JSON.stringify(response.data.output, null, 2),
			});
			setShowProcessPanel(true);
			alert("Process completed successfully!");
		} catch (error) {
			console.error("Error starting process:", error);
			alert("Failed to start process.");
		}
	};

	const selectedUser = users.find((user) => user.id === selectedUserId);

	return (
		<Box display="flex" p={2}>
			{/* بخش گراف کاربران */}
			<Box
				flex={2}
				style={{
					height: "80vh",
					border: "1px solid #ddd",
					borderRadius: "8px",
				}}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onNodeClick={(event, node) => setSelectedUserId(parseInt(node.id))}
				>
					<Background />
					<Controls />
				</ReactFlow>
			</Box>

			{/* بخش اطلاعات کاربر انتخابشده */}
			{selectedUser && (
				<Box flex={1} ml={2}>
					<Paper elevation={3} style={{ padding: "16px" }}>
						<Typography variant="h6">
							Selected User: {selectedUser.name}
						</Typography>

						{/* نمایش UserScreen به صورت کوچک */}
						<Box mt={2} display="flex" alignItems="center">
							<Typography variant="body1">User Screen:</Typography>
							<IconButton onClick={() => setOpenUserScreen(true)}>
								<DesktopWindows />
							</IconButton>
						</Box>

						{/* ایجاد کاربر فرزند */}
						<Box mt={2}>
							<TextField
								label="New Child Name"
								value={newChildName}
								onChange={(e) => setNewChildName(e.target.value)}
								fullWidth
								margin="normal"
							/>
							<TextField
								fullWidth
								label="Child Description"
								value={newChildDescription}
								onChange={(e) => setNewChildDescription(e.target.value)}
								margin="normal"
								multiline
								rows={4}
								variant="outlined"
							/>
							<Button
								variant="contained"
								color="primary"
								onClick={handleCreateChild}
							>
								Create Child User
							</Button>
						</Box>

						{/* اختصاص تسک */}
						<Box mt={2}>
							<TextField
								label="Task Description"
								value={taskDescription}
								onChange={(e) => setTaskDescription(e.target.value)}
								fullWidth
								margin="normal"
							/>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleAssignTask}
							>
								Assign Task
							</Button>
						</Box>

						{/* اجرای پردازش */}
						<Box mt={2}>
							<Button
								variant="contained"
								color="success"
								onClick={handleProcess}
							>
								Start Process
							</Button>
						</Box>

						{/* لیست تسکها */}
						<Box mt={2}>
							<Typography variant="h6">Tasks:</Typography>
							<List>
								{tasks.map((task) => (
									<ListItem key={task.id}>
										<ListItemText primary={task.description} />
									</ListItem>
								))}
							</List>
						</Box>
					</Paper>
				</Box>
			)}

			{/* پنل نمایش پرامپت و خروجی */}
			{showProcessPanel && (
				<Modal
					open={showProcessPanel}
					onClose={() => setShowProcessPanel(false)}
				>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: "60%",
							height: "60%",
							bgcolor: "background.paper",
							boxShadow: 24,
							p: 4,
							overflow: "auto",
						}}
					>
						<Typography variant="h6">Process Prompt:</Typography>
						<Paper
							elevation={3}
							style={{ padding: "16px", marginBottom: "16px" }}
						>
							<pre>{processData.prompt}</pre>
						</Paper>

						<Typography variant="h6">Process Output:</Typography>
						<Paper elevation={3} style={{ padding: "16px" }}>
							<pre>{processData.output}</pre>
						</Paper>
					</Box>
				</Modal>
			)}

			{/* مودال برای نمایش بزرگتر UserScreen */}
			<Modal open={openUserScreen} onClose={() => setOpenUserScreen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "80%",
						height: "80%",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
					}}
				>
					<UserScreen vncPort={selectedUser?.vnc_port} />
				</Box>
			</Modal>
		</Box>
	);
}

export default UserTree;
