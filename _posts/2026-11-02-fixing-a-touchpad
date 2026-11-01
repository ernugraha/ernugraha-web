---
layout: post
title: Fixing a Sentelic Touchpad That Dies on Cold Boot in Linux
subtitle: Touchpad only works after booting into Windows first? Linux can fix it by itself.
tags: [linux]
comments: true
author: ernugraha
---

{: .box-note}
**Summary:** On my laptop, the touchpad never worked when I booted straight into Linux from a powered-off state (a *cold boot*). It only came alive if I booted into Windows first and then rebooted into Linux. This went on for about six years. The fix turned out to be one small script and one systemd service, with no dual boot required.

## Symptoms

- Power on from a full shutdown and boot straight into Linux: **the touchpad does not work at all**.
- Power on, boot into Windows, then reboot into Linux: **the touchpad works normally**.
- In Windows, the touchpad always works.
- USB mice work fine, so the problem is limited to the touchpad.

I did not want to dual boot just to get a working touchpad, so I went looking for the root cause.

## System specs

| Component | Details |
| :------ | :--- |
| CPU | Intel Core i5-3230M |
| Chipset | Intel HM77 |
| Operating system | Debian 13 (trixie), kernel 6.12 |
| Desktop | KDE Plasma 6 (Wayland) |
| Touchpad | FSPPS/2 Sentelic FingerSensingPad |

## Step 1: Find out how the touchpad is connected

The HM77 chipset (Intel 7 Series) has no I2C controller, so the touchpad is almost certainly connected over **PS/2**. After a cold boot, with the touchpad dead, I checked the kernel log:

```bash
sudo dmesg | grep -i -E "psmouse|i8042|serio|synaptics|elan|alps|touchpad"
cat /proc/bus/input/devices | grep -i -A5 -E "touchpad|mouse|synaptics|elan"
```

The results:

- The `i8042` controller was detected and an AUX port was registered.
- **There was not a single `psmouse` message**, and no touchpad device in `/proc/bus/input/devices`. Only the USB mice showed up.

In other words, the kernel found nothing on the AUX port.

## Step 2: Test whether the touchpad is really dead

I tried the kernel parameter `i8042.nomux`, but the touchpad was still not detected. Then I took over the AUX port manually through `serio_raw`, so I could talk to the device directly:

```bash
# Replace serio1 with the AUX port number on your system
echo -n serio_raw | sudo tee /sys/bus/serio/devices/serio1/drvctl
ls -l /dev/serio_raw*
```

Next, I sent the PS/2 reset command (`0xFF`) and read the reply:

```bash
sudo bash -c 'exec 3<>/dev/serio_raw0; printf "\xff" >&3; timeout 3 od -An -tx1 -N3 <&3'
```

The reply:

```
 fa aa 00
```

That is the normal answer of a healthy PS/2 device: `fa` (acknowledge), `aa` (self-test passed), and `00` (standard mouse ID). **The touchpad was alive and answering.** My initial guess, that the BIOS or embedded controller had switched it off, was wrong.

Then I sent the enable command (`0xF4`) and moved a finger across the touchpad:

```bash
sudo bash -c 'exec 3<>/dev/serio_raw0; printf "\xf4" >&3; timeout 10 od -An -tx1 -w3 -v <&3'
```

Valid three-byte packets appeared and changed with my finger movement. So the touchpad was perfectly healthy, even from a cold boot.

{: .box-note}
**Note:** `xxd` is not installed on Debian by default, so I used `od`, which ships with coreutils.

## Step 3: Hand the port back to psmouse

After manually resetting the device, I gave the port back to the `psmouse` driver:

```bash
echo -n psmouse | sudo tee /sys/bus/serio/devices/serio1/drvctl
```

This time **the touchpad was detected immediately and worked**. In the input device list it appears as `FSPPS/2 Sentelic FingerSensingPad`:

```bash
sudo libinput list-devices | grep -i -A6 Sentelic
```

## The permanent fix: a script and a systemd service

I automated the sequence that worked (reset, enable, then hand the port back to `psmouse`) so it runs at every boot.

### The script

```bash
sudo tee /usr/local/sbin/touchpad-fix.sh > /dev/null <<'EOF'
#!/bin/bash
# Fix for a Sentelic touchpad that is not detected on cold boot

detected() {
  grep -qE "Sentelic|FSPPS/2" /proc/bus/input/devices
}

# Find the i8042 AUX port (the serio number may differ)
find_port() {
  for d in /sys/bus/serio/devices/serio*; do
    grep -q "AUX" "$d/description" 2>/dev/null && { echo "$d"; return; }
  done
}

# Already detected, nothing to do
detected && exit 0

modprobe serio_raw

for i in 1 2 3; do
  P=$(find_port)
  [ -z "$P" ] && exit 1

  echo -n serio_raw > "$P/drvctl"
  sleep 1
  R=$(ls /dev/serio_raw* 2>/dev/null | head -n1)
  if [ -n "$R" ]; then
    exec 3<>"$R"
    printf '\xff' >&3   # reset
    sleep 1
    printf '\xf4' >&3   # enable
    sleep 1
    exec 3>&-
  fi
  echo -n psmouse > "$P/drvctl"
  sleep 2

  detected && exit 0
done

exit 1
EOF
sudo chmod +x /usr/local/sbin/touchpad-fix.sh
```

{: .box-warning}
**Warning:** the `Sentelic|FSPPS/2` pattern in the `detected` function is specific to the touchpad in this laptop. If your touchpad is a different brand, check its device name in `/proc/bus/input/devices` and adjust the pattern.

### The systemd service

```bash
sudo tee /etc/systemd/system/touchpad-fix.service > /dev/null <<'EOF'
[Unit]
Description=Reset and re-detect the Sentelic touchpad at boot
After=systemd-modules-load.service local-fs.target
Before=display-manager.service

[Service]
Type=oneshot
ExecStartPre=/bin/sleep 2
ExecStart=/usr/local/sbin/touchpad-fix.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable touchpad-fix.service
```

### Test from a cold boot

```bash
sudo poweroff
```

Wait about 10 seconds, power the laptop back on, and boot straight into Linux without touching Windows. After logging in:

```bash
systemctl status touchpad-fix.service
grep -i Sentelic /proc/bus/input/devices
```

The result: **the touchpad works from the very start**, no Windows needed.

## What is the cause?

I have not proven the exact cause, but the evidence points to the following explanation.

The touchpad is not broken. What fails is **the automatic detection step of the `psmouse` driver** during a cold boot. In that initial state, the touchpad apparently does not answer the driver's probing sequence correctly, so the kernel gives up without any error message. After Windows has run, the Windows driver has already initialized the touchpad, and a warm reboot does not cut power to the device, so detection in Linux succeeds. The script above imitates that effect by sending the reset and enable commands itself before detection is retried.

{: .box-warning}
**An honest caveat:** this is a conclusion drawn from how the system behaves, not from reading the firmware. I also have not confirmed whether the `i8042.nomux` kernel parameter plays a role. It was still active in my configuration when this service worked. To find out, remove it from GRUB, run `sudo update-grub`, and test a cold boot again.

<details markdown="1">
<summary>Bonus: scroll direction reversed?</summary>

If two-finger scrolling feels backwards, open **System Settings** → **Mouse & Touchpad** → **Touchpad**, select the Sentelic device, toggle **Invert scroll direction (Natural scrolling)**, and click **Apply**. This setting is unrelated to the script above.

</details>

<details markdown="1">
<summary>If the touchpad dies again after suspend</summary>

Restart the service manually:

```bash
sudo systemctl restart touchpad-fix.service
```

If this happens often, the service can be hooked into the resume event so it runs automatically.

</details>

## Recap

1. A PS/2 touchpad that does not show up in `dmesg` is not necessarily broken. Test it directly through `serio_raw`.
2. The reply `fa aa 00` after a reset command means the device is alive.
3. Sending reset and enable commands yourself, then handing the port back to `psmouse`, makes the touchpad get detected.
4. That sequence is automated with one script and one systemd service.

If you have similar symptoms, leave a comment below with your `dmesg` output and the name of your touchpad device.
