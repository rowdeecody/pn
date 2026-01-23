import Migration from '../../core/migration';

(async () => {
    const action: string = process.argv[2];

    if (action === 'up' || action === 'down') {
        // Add your migration calls here, e.g.:
        // await Migration.call(MyMigration, action);

        await Migration.run();
    }
})();
