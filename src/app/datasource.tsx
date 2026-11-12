interface Appointment {
    Id: number;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    IsAllDay: boolean;
    ProjectId: number;
    TaskId: number;
}

export const scheduleData: Appointment[] = [
    {
        Id: 61,
        Subject: 'Decoding',
        StartTime: new Date(2026, 6, 20, 9, 30),
        EndTime: new Date(2026, 6, 20, 10, 30),
        IsAllDay: false,
        ProjectId: 2,
        TaskId: 2
    }, {
        Id: 62,
        Subject: 'Bug Automation',
        StartTime: new Date(2026, 6, 20, 13, 30),
        EndTime: new Date(2026, 6, 20, 16, 30),
        IsAllDay: false,
        ProjectId: 2,
        TaskId: 1
    }, {
        Id: 63,
        Subject: 'Functionality testing',
        StartTime: new Date(2026, 6, 20, 9),
        EndTime: new Date(2026, 6, 20, 10, 30),
        IsAllDay: false,
        ProjectId: 1,
        TaskId: 1
    }, {
        Id: 64,
        Subject: 'Resolution-based testing',
        StartTime: new Date(2026, 6, 20, 12),
        EndTime: new Date(2026, 6, 20, 13),
        IsAllDay: false,
        ProjectId: 1,
        TaskId: 1
    }, {
        Id: 65,
        Subject: 'Test report Validation',
        StartTime: new Date(2026, 6, 20, 15),
        EndTime: new Date(2026, 6, 20, 18),
        IsAllDay: false,
        ProjectId: 1,
        TaskId: 1
    }, {
        Id: 66,
        Subject: 'Test case correction',
        StartTime: new Date(2026, 6, 20, 14),
        EndTime: new Date(2026, 6, 20, 16),
        IsAllDay: false,
        ProjectId: 1,
        TaskId: 2
    }, {
        Id: 67,
        Subject: 'Bug fixing',
        StartTime: new Date(2026, 6, 20, 14, 30),
        EndTime: new Date(2026, 6, 20, 18, 30),
        IsAllDay: false,
        ProjectId: 2,
        TaskId: 2
    }, {
        Id: 68,
        Subject: 'Run test cases',
        StartTime: new Date(2026, 6, 20, 17, 30),
        EndTime: new Date(2026, 6, 20, 19, 30),
        IsAllDay: false,
        ProjectId: 1,
        TaskId: 2
    }, {
        Id: 70,
        Subject: 'Bug Automation',
        StartTime: new Date(2026, 6, 20, 18, 30),
        EndTime: new Date(2026, 6, 20, 20),
        IsAllDay: false,
        ProjectId: 2,
        TaskId: 1
    }
];