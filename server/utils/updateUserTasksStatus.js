export function updateUserTasksStatus(userDocument) {
    let user = userDocument.toObject();
    for (let challengeIndex = 0; challengeIndex < user.challenges.length; challengeIndex++) {
        let statusMap = new Map();
        for (let taskStatus of user.challenges[challengeIndex].tasksStatus) {
            statusMap.set(taskStatus.task.toString(), taskStatus.completed);
        }

        let tasksWithStatus = user.challenges[challengeIndex].challenge.tasks.map(task => ({
            ...task,
            completed: statusMap.has(task._id.toString()) ? statusMap.get(task._id.toString()) : false
        }));

        user.challenges[challengeIndex].challenge.tasks = tasksWithStatus;
    }
    return user;
}
