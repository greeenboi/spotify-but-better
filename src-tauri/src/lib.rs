use tauri_plugin_sql::{Migration, MigrationKind};
#[cfg_attr(mobile, tauri::mobile_entry_point)]
mod commands;

pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_playlists_table",
            sql: "CREATE TABLE IF NOT EXISTS playlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                artist TEXT,
                image TEXT,
                file_location TEXT NOT NULL,
                playlist TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:playlists.db", migrations)
            .build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .level(log::LevelFilter::Error)
                        .level(log::LevelFilter::Warn)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::open_link_on_click])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
