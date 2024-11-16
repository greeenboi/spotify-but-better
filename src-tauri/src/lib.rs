#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod commands;

pub fn run() {
    tauri::Builder::default()
        
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::open_link_on_click])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
