import { spawnSync } from 'node:child_process';

const message = process.argv.slice(2).join(' ').trim();

if (!message) {
    console.error('Usage: npm run push -- "pesan commit"');
    process.exit(1);
}

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options,
    });

    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

run('php', ['artisan', 'wayfinder:generate']);
run('npm', ['run', 'check']);
run('npm', ['run', 'types:check']);
run('git', ['add', '-A'], { shell: false });

const staged = spawnSync('git', ['diff', '--cached', '--name-only'], {
    encoding: 'utf8',
    shell: false,
});

if (staged.error) {
    console.error(staged.error.message);
    process.exit(1);
}

if (staged.status !== 0) {
    process.exit(staged.status ?? 1);
}

if (staged.stdout.trim()) {
    run('git', ['commit', '--file=-'], {
        shell: false,
        stdio: ['pipe', 'inherit', 'inherit'],
        input: `${message}\n`,
    });
} else {
    console.log('Nothing to commit.');
}

run('git', ['push', 'origin', 'HEAD'], { shell: false });
